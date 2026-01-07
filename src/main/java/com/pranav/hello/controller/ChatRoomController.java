package com.pranav.hello.controller;

import com.pranav.hello.model.ChatRoom;
import com.pranav.hello.model.User;
import com.pranav.hello.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chatroom")
@CrossOrigin(origins = "*")  
public class ChatRoomController {
    
    @Autowired  
    private ChatRoomService chatRoomService;
    
    
    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> request) {
        String hostName = request.get("hostName");
        
        
        if (hostName == null || hostName.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Host name is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        
        ChatRoom room = chatRoomService.createRoom(hostName);
        
        
        Map<String, Object> response = new HashMap<>();
        response.put("roomCode", room.getRoomCode());
        response.put("hostName", room.getHostName());
        response.put("message", "Room created successfully");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    
    @PostMapping("/join")
    public ResponseEntity<?> joinRoom(@RequestBody Map<String, String> request) {
        String roomCode = request.get("roomCode");
        String username = request.get("username");
        
        
        if (roomCode == null || roomCode.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Room code is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        if (username == null || username.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Username is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        
        if (!chatRoomService.roomExists(roomCode)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Room not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        
        
        ChatRoom room = chatRoomService.getRoom(roomCode);
        
        Map<String, Object> response = new HashMap<>();
        response.put("roomCode", room.getRoomCode());
        response.put("hostName", room.getHostName());
        response.put("message", "Room found. Connect via WebSocket to join.");
        
        return ResponseEntity.ok(response);
    }
    
    
    @GetMapping("/{roomCode}")
    public ResponseEntity<?> getRoomDetails(@PathVariable String roomCode) {
        if (!chatRoomService.roomExists(roomCode)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Room not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        
        ChatRoom room = chatRoomService.getRoom(roomCode);
        
        Map<String, Object> response = new HashMap<>();
        response.put("roomCode", room.getRoomCode());
        response.put("hostName", room.getHostName());
        response.put("userCount", room.getUsers().size());
        response.put("users", room.getUsers());
        
        return ResponseEntity.ok(response);
    }
}