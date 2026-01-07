package com.pranav.hello.model;

import java.util.ArrayList;
import java.util.List;

public class ChatRoom {
    private String roomCode;        
    private String hostName;        
    private List<User> users;       
    private List<ChatMessage> messages; 
    
    
    public ChatRoom(String roomCode, String hostName) {
        this.roomCode = roomCode;
        this.hostName = hostName;
        this.users = new ArrayList<>();     
        this.messages = new ArrayList<>();   
    }
    
    
    public String getRoomCode() { 
        return roomCode; 
    }
    
    public void setRoomCode(String roomCode) { 
        this.roomCode = roomCode; 
    }
    
    public String getHostName() { 
        return hostName; 
    }
    
    public void setHostName(String hostName) { 
        this.hostName = hostName; 
    }
    
    public List<User> getUsers() { 
        return users; 
    }
    
    public void setUsers(List<User> users) { 
        this.users = users; 
    }
    
    public List<ChatMessage> getMessages() { 
        return messages; 
    }
    
    public void setMessages(List<ChatMessage> messages) { 
        this.messages = messages; 
    }
    
    
    public void addUser(User user) {
        this.users.add(user);
    }
    
    
    public void removeUser(String username) {
        this.users.removeIf(user -> user.getUsername().equals(username));
    }
    
    
    public void addMessage(ChatMessage message) {
        this.messages.add(message);
    }
}