import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

export default function ChatScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { userId, userName } = route.params || {};
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");

    // Carregar mensagens do Firestore ao abrir o chat
    useEffect(() => {
        if (!userId) return;
        const unsubscribe = firestore()
            .collection("chats")
            .doc(userId)
            .collection("messages")
            .orderBy("createdAt", "asc")
            .onSnapshot(snapshot => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(msgs);
            });
        return unsubscribe;
    }, [userId]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || !userId) return;

        const newMessage = {
            text: inputText,
            sender: "me",
            createdAt: new Date().toISOString(),
        };

        try {
            await firestore()
                .collection("chats")
                .doc(userId)
                .collection("messages")
                .add(newMessage);
            setInputText("");
        } catch (e) {
            
            console.log("Erro ao enviar mensagem", e);
        }
    };

    const renderMessage = ({ item }) => (
        <View
            style={{
                marginVertical: 8,
                marginHorizontal: 12,
                alignSelf: item.sender === "me" ? "flex-end" : "flex-start",
                backgroundColor: item.sender === "me" ? "#007BFF" : "#f0f0f0",
                padding: 10,
                borderRadius: 8,
                maxWidth: "80%",
            }}
        >
            <Text style={{ color: item.sender === "me" ? "#fff" : "#000" }}>
                {item.text}
            </Text>
            <Text
                style={{
                    color: item.sender === "me" ? "#ddd" : "#999",
                    fontSize: 12,
                    marginTop: 4,
                }}
            >
                {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : ""}
            </Text>
        </View>
    );

    // Função para excluir usuário
    const excluirUsuario = () => {
        Alert.alert(
            "Excluir usuário",
            `Tem certeza que deseja excluir ${userName || "este usuário"}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Remove usuário do Firestore
                            await firestore().collection("users").doc(userId).delete();
                            // Remove mensagens do chat
                            const msgsSnap = await firestore()
                                .collection("chats")
                                .doc(userId)
                                .collection("messages")
                                .get();
                            const batch = firestore().batch();
                            msgsSnap.forEach(doc => batch.delete(doc.ref));
                            await batch.commit();
                            navigation.goBack();
                        } catch (e) {
                            Alert.alert("Erro ao excluir usuário", e.message);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View
                style={{
                    backgroundColor: "#007BFF",
                    padding: 12,
                    paddingTop: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 20,
                        fontWeight: "bold",
                    }}
                >
                    {userName || "Chat"}
                </Text>
                <TouchableOpacity onPress={excluirUsuario} style={{ marginLeft: 16, padding: 4 }}>
                    <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>X</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={{ flex: 1, padding: 8 }}
                inverted
            />

            <View
                style={{
                    flexDirection: "row",
                    padding: 12,
                    borderTopWidth: 1,
                    borderTopColor: "#ddd",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <TextInput
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 20,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        marginRight: 8,
                        backgroundColor: "#fff",
                    }}
                    placeholder="Digite uma mensagem..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    maxHeight={100}
                />
                <TouchableOpacity
                    onPress={handleSendMessage}
                    style={{
                        backgroundColor: "#007BFF",
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
