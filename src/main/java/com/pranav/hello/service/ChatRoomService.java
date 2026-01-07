package com.pranav.hello.service;

import com.pranav.hello.model.ChatRoom;
import com.pranav.hello.model.User;
import com.pranav.hello.model.ChatMessage;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service  
public class ChatRoomService {
    
    
    private Map<String, ChatRoom> chatRooms = new HashMap<>();
    
    
    public String generateRoomCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        
       
        for (int i = 0; i < 6; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        
        return code.toString();
    }
    
    
    public ChatRoom createRoom(String hostName) {
        String roomCode = generateRoomCode();
        
        
        while (chatRooms.containsKey(roomCode)) {
            roomCode = generateRoomCode();
        }
        
        ChatRoom room = new ChatRoom(roomCode, hostName);
        chatRooms.put(roomCode, room);  
        
        return room;
    }
    

    public ChatRoom getRoom(String roomCode) {
        return chatRooms.get(roomCode);
    }
    
    
    public boolean roomExists(String roomCode) {
        return chatRooms.containsKey(roomCode);
    }
    
    
    public boolean addUserToRoom(String roomCode, User user) {
        ChatRoom room = chatRooms.get(roomCode);
        
        if (room != null) {
            room.addUser(user);
            
           
            ChatMessage joinMessage = new ChatMessage(
                user.getUsername(), 
                user.getUsername() + " joined the room", 
                "JOIN"
            );
            room.addMessage(joinMessage);
            
            return true;
        }
        
        return false;
    }
    
    
    public void removeUserFromRoom(String roomCode, String username) {
        ChatRoom room = chatRooms.get(roomCode);
        
        if (room != null) {
            room.removeUser(username);
            
            
            ChatMessage leaveMessage = new ChatMessage(
                username, 
                username + " left the room", 
                "LEAVE"
            );
            room.addMessage(leaveMessage);
            
            
            if (room.getUsers().isEmpty()) {
                chatRooms.remove(roomCode);
            }
        }
    }
    
    
    public void addMessageToRoom(String roomCode, ChatMessage message) {
        ChatRoom room = chatRooms.get(roomCode);
        
        if (room != null) {
            room.addMessage(message);
        }
    }
}