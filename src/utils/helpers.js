//Função para formatar o carimbo de data/hora em uma data e hora legíveis//Function to format the timestamp into a readable date and time
export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.toMillis());
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

//Função para gerar uma chave única para mensagens ou outros itens//Function to generate a unique key for messages or other itens
export const generateKey = () => {
    return Math.random().toString(36).substring(2,10);
};

//Função para classificar mensagens com base em seu carimbo de data/hora//Function to sort messages based on their timestamp
export const sortMessagesByTimestamp = (messages) =>{
    return messages.sort(
        (a, b) =>a.timestamp.toMillis() - b.timestamp.toMillis()
    );
};