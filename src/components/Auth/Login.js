
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

export default function Login() {
    const [numTel, setPhoneNumber] = useState("");
    const navigation = useNavigation();

    // Preenche o número ao retornar da Usuario
    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            if (navigation && navigation.getState) {
                const routes = navigation.getState().routes;
                const lastRoute = routes[routes.length - 1];
                if (lastRoute && lastRoute.params && lastRoute.params.phone) {
                    const phone = lastRoute.params.phone;
                    const phoneRegex = /^\+\d{10,15}$/;
                    if (phoneRegex.test(phone)) {
                        setPhoneNumber(phone);
                        if (lastRoute.params.autoLogin) {
                            checkAndNavigate(phone);
                        }
                    } else {
                        // Se não estiver formatado, não insere
                        setPhoneNumber("");
                    }
                }
            }
        });
        return unsubscribe;
    }, [navigation]);

    const checkAndNavigate = async (phone) => {
        const phoneRegex = /^\+\d{10,15}$/;
        if (!phoneRegex.test(phone)) return;
        try {
            const fireConfirm = await firestore()
                .collection("users")
                .where("phone", "==", phone)
                .limit(1)
                .get();
            if (!fireConfirm.empty) {
                const userDoc = fireConfirm.docs[0];
                navigation.navigate("Dashboard", {
                    userId: userDoc.id,
                    userName: userDoc.data().name || "Usuário",
                });
            }
        } catch (e) {}
    };

    const handleLogin = async () => {
        const phoneRegex = /^\+\d{10,15}$/;
        if (!phoneRegex.test(numTel)) {
            alert("Número inválido. Exemplo: +5542988704065");
            return;
        }
        try {
            const fireConfirm = await firestore()
                .collection("users")
                .where("phone", "==", numTel)
                .limit(1)
                .get();
            if (!fireConfirm.empty) {
                // Usuário existe, navega para Dashboard
                const userDoc = fireConfirm.docs[0];
                navigation.navigate("Dashboard", {
                    userId: userDoc.id,
                    userName: userDoc.data().name || "Usuário",
                });
            } else {
                // Usuário não existe, navega para Usuario passando o número
                alert("Número não encontrado. Por favor, complete seu cadastro.");
                navigation.navigate("Usuario", { phone: numTel });
            }
        } catch (e) {
            alert("Erro ao buscar usuário: " + e.message);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#000",
                justifyContent: "center",
                padding: 20,
            }}
        >
            <View
                style={{
                    backgroundColor: "#ADD8E6",
                    borderRadius: 20,
                    padding: 24,
                }}
            >
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: "bold",
                        marginBottom: 32,
                        textAlign: "center",
                        color: "#222",
                    }}
                >
                    WhatZaapp 2
                </Text>
                <Text
                    style={{
                        marginBottom: 16,
                        fontSize: 18,
                        color: "#333",
                    }}
                >
                    Número de telefone com código do país:
                </Text>
                <TextInput
                    style={{
                        height: 50,
                        width: "100%",
                        borderColor: "#007BFF",
                        borderWidth: 1,
                        marginBottom: 24,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        backgroundColor: "#fff",
                        fontSize: 18,
                    }}
                    placeholder="+5542988704065"
                    value={numTel}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
                <TouchableOpacity
                    onPress={handleLogin}
                    style={{
                        backgroundColor: "#007BFF",
                        padding: 14,
                        borderRadius: 8,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 22,
                            fontWeight: "bold",
                        }}
                    >
                        Entrar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
                