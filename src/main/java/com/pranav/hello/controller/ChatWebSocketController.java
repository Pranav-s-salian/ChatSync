package com.pranav.hello.controller;

import com.pranav.hello.model.ChatMessage;
import com.pranav.hello.model.User;
import com.pranav.hello.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller  
public class ChatWebSocketController {

    @Autowired
    private ChatRoomService chatRoomService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;  

    
    @MessageMapping("/chat.sendMessage/{roomCode}")
    public void sendMessage(@DestinationVariable String roomCode, 
                           @Payload ChatMessage chatMessage) {

        chatMessage.setType("CHAT");
        chatRoomService.addMessageToRoom(roomCode, chatMessage);
        messagingTemplate.convertAndSend("/topic/chatroom/" + roomCode, chatMessage);
    }
    @MessageMapping("/chat.addUser/{roomCode}")
    public void addUser(@DestinationVariable String roomCode,
                       @Payload ChatMessage chatMessage,
                       SimpMessageHeaderAccessor headerAccessor) {
        
        
        String sessionId = headerAccessor.getSessionId();
        
        
        headerAccessor.getSessionAttributes().put("username", chatMessage.getUsername());
        headerAccessor.getSessionAttributes().put("roomCode", roomCode);
        
        
        User user = new User(chatMessage.getUsername(), sessionId);
        chatRoomService.addUserToRoom(roomCode, user);
        chatMessage.setType("JOIN");
        chatMessage.setContent(chatMessage.getUsername() + " joined the chat");
        messagingTemplate.convertAndSend("/topic/chatroom/" + roomCode, chatMessage);
    }
}