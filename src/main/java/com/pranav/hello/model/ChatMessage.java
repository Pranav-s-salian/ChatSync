package com.pranav.hello.model;

import java.time.LocalDateTime;

public class ChatMessage {
    private String username;      
    private String content;       
    private String type;          
    private LocalDateTime timestamp; 
    
    
    public ChatMessage() {
        this.timestamp = LocalDateTime.now(); 
    }
    
    
    public ChatMessage(String username, String content, String type) {
        this.username = username;
        this.content = content;
        this.type = type;
        this.timestamp = LocalDateTime.now();
    }
    
    
    public String getUsername() { 
        return username; 
    }
    
    public void setUsername(String username) { 
        this.username = username; 
    }
    
    public String getContent() { 
        return content; 
    }
    
    public void setContent(String content) { 
        this.content = content; 
    }
    
    public String getType() { 
        return type; 
    }
    
    public void setType(String type) { 
        this.type = type; 
    }
    
    public LocalDateTime getTimestamp() { 
        return timestamp; 
    }
    
    public void setTimestamp(LocalDateTime timestamp) { 
        this.timestamp = timestamp; 
    }
}