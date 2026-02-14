import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function Dashboard({ route }) {
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) return;

        const fetchUsers = async () => {
            try {
                const usersSnapshot = await firestore().collection("users").get();
                const usersData = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
            } catch (error) {
                console.log("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, [isFocused]);

    const navigateToChat = (userId, userName) => {
        navigation.navigate("ChatScreen", {
            userId,
            userName,
        });
    };

    const handleAddUser = () => {
        navigation.navigate("Usuario");
    };

    return(
        <View
            style={{
                flex:1,
                backgroundColor:"#000",
                position:"relative",
            }}
            >
                <View
                    style={{
                        flex:1,
                        backgroundColor:"#000",
                        position:"absolute",
                        top:0,
                        left:0,
                        right:0,
                        height:"20%",
                        justifyContent:"center",
                    }}
                    >
                        <Text
                            style={{
                                fontSize:23,
                                fontWeight:"bold",
                                margin:10,
                                color:"#fff",
                            }}>
                                {route?.params?.userName || "Home"}
                        </Text>
                        
                            <View
                                style={{
                                    flexDirection:"row",
                                    justifyContent:"space-between",
                                    alignItems:"center",
                                }}>
                                    <Text style={{
                                        fontSize:24,color:"#fff",margin:10
                                    }}>
                                        Usuários
                                    </Text>
                                    <TouchableOpacity onPress={handleAddUser}>
                                        <Text
                                            style={{
                                                fontSize:24,
                                                color:"#43A047",
                                                margin:10,
                                                fontWeight:"bold"
                                            }}>
                                                + Novo
                                            </Text>
                                    </TouchableOpacity>
                                </View>
                    </View>
                    <View 
                        style={{
                            flex:1,
                            backgroundColor:"#ADD8E6",
                            padding:5,
                            borderTopRightRadius:100,
                            position:"absolute",
                            top:"20%",
                            left:0,
                            right:0,
                            bottom:0,
                        }}
                        >
                            <FlatList
                                data={users}
                                keyExtractor={(item) => item.id}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        onPress={() => navigateToChat(item.id,item.name)}
                                        style={{
                                            marginBottom:5,
                                            borderRadius:5,
                                            overflow:"hidden",
                                        }}
                                        >
                                            <LinearGradient
                                                colors={["rgba(0,0,0,1)","rgba(128,128,128,0)"]}
                                                style={{
                                                    padding:15,
                                                    borderRadius:30,
                                                }}
                                                start={{x:0,y:0}}
                                                end={{x:1,y:0}}
                                                >
                                                    <Text
                                                        style={{
                                                            color:"white",
                                                            fontSize:20,
                                                            fontWeight:"bold",
                                                        }}>
                                                            {item.name}
                                                        </Text>
                                                </LinearGradient>
                                        </TouchableOpacity>
                                )}
                            />
                    </View>
                    <Text
                            style={{
                                fontSize:20,
                                fontWeight:"bold",
                                position:"absolute",
                                bottom:0,
                                left:0,
                                right:0,
                                textAlign:"center",
                                color:"#333",
                            }}
                                >
                                    @2026-Gabriel_Olímpio&&Andre_Vieira
                                </Text>
        </View>
    );
}