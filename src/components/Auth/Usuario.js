import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";

export default function Usuario({ route, navigation }) {
    const [name, setName] = useState("");
    const [dob, setDob] = useState(new Date());
    const [gender, setGender] = useState("Masculino");
    const [phone, setPhone] = useState(route?.params?.phone || "");
    const [loading, setLoading] = useState(false);

    const saveUsuarios = async () => {
        if (!name.trim()) {
            alert("Por favor, insira seu nome");
            return;
        }
        const phoneRegex = /^\+\d{10,15}$/;
        if (!phoneRegex.test(phone)) {
            alert("Número inválido. Exemplo: +5542988704065");
            return;
        }
        setLoading(true);
        try {
            // Checa se já existe usuário com esse número
            const querySnap = await firestore()
                .collection("users")
                .where("phone", "==", phone)
                .limit(1)
                .get();
            let userId;
            if (!querySnap.empty) {
                // Atualiza usuário existente
                userId = querySnap.docs[0].id;
                await firestore().collection("users").doc(userId).update({
                    name,
                    dob: dob.toISOString().slice(0, 10),
                    gender,
                    displayName: name,
                    updatedAt: new Date(),
                });
                alert("Usuário atualizado com sucesso!");
                // Se veio da tela Login, retorna para Login preenchendo o número
                if (route?.params?.phone) {
                    navigation.navigate("Login", { phone });
                } else {
                    navigation.navigate("Dashboard");
                }
            } else {
                // Cria novo usuário
                const userRef = firestore().collection("users").doc();
                userId = userRef.id;
                await userRef.set({
                    name,
                    dob: dob.toISOString().slice(0, 10),
                    gender,
                    displayName: name,
                    phone,
                    createdAt: new Date(),
                });
                alert("Usuário criado com sucesso!");
                // Se veio da tela Login, retorna para Login preenchendo o número
                if (route?.params?.phone) {
                    navigation.navigate("Login", { phone });
                } else {
                    navigation.navigate("Dashboard");
                }
            }
            setLoading(false);
            Alert.alert("Usuário salvo com sucesso!");
        } catch (error) {
            setLoading(false);
            alert("Erro ao salvar usuário: " + error.message);
            console.log("Error saving Usuarios", error);
        }
    };
    return(
        <View
            style={{
                flex:1,
                backgroundColor:"#000",
                position:"relative",
            }}
        >
            {/* <View
                style={{
                    flex:1,
                    backgroundColor: "#000",
                    position:"absolute",
                    top:0,
                    left:0,
                    right:0,
                    height:"10%",
                }}
            /> */}
            <View
                style={{
                    flex:1,
                    backgroundColor:"#ADD8E6",
                    borderTopRightRadius:100,
                    padding:0,
                    borderTopRadius:0,
                    position:"absolute",
                    top:"20%",
                    left:0,
                    right:0,
                    bottom:0,
                    alignItems:"center",
                    justifyContent:'flex-start',
                }}
            >
                <Text
                    style={{
                        fontSize:32,
                        fontWeight:"bold",
                        marginBotton:40,
                        marginTop:150,
                    }}
                >
                    Dados do novo usuário:
                </Text>
                <TextInput
                    style={{
                        height:50,
                        width:"100%",
                        borderColor:"black",
                        borderWidth:1,
                        marginBottom:20,
                        paddingHorizontal:10,
                        borderRadius:10,
                    }}
                    placeholder="Número de telefone (+5542988704065)"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={{
                        height:50,
                        width:"100%",
                        borderColor:"black",
                        borderWidth:1,
                        marginBottom:30,
                        paddingHorizontal:10,
                        borderRadius:10,
                    }}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />

                <DatePicker
                    style={{
                        height: 80,
                        width: Dimensions.get("window").width - 40,
                        marginBottom: 30,
                    }}
                    date={dob}
                    onDateChange={setDob}
                    mode="date"
                />

                <Picker
                    style={{
                        height: 50,
                        width: "100%",
                        marginBottom: 30,
                        borderColor: "black",
                        backgroundColor: "#dce8e9ff",
                    }}
                    selectedValue={gender}
                    onValueChange={setGender}
                >
                    <Picker.Item label="Masculino" value="Masculino"/>
                    <Picker.Item label="Feminino" value="Feminino"/>
                    <Picker.Item label="Tardígrado" value="Tardígrado"/>
                </Picker>

                <TouchableOpacity
                    onPress={saveUsuarios}
                    disabled={loading}
                    style={{
                        backgroundColor: loading ? "#999" : "#007BFF",
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 20,
                        alignItems: "center",
                    }}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color="#fff" />
                    ) : (
                        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
                            Salvar dados
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}