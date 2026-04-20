package net.kpuig.shoebill.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import net.kpuig.shoebill.backend.datamodels.channel.GetAllChannelsFromServerResponse;
import net.kpuig.shoebill.backend.datamodels.channel.GetChannelResponse;
import net.kpuig.shoebill.backend.datamodels.channel.PostChannelRequest;
import net.kpuig.shoebill.backend.datamodels.channel.PostChannelResponse;
import net.kpuig.shoebill.backend.services.ChannelService;
import net.kpuig.shoebill.backend.services.exceptions.NotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api")
public class ChannelController {
    @Autowired private ChannelService channelService;

    @Operation(summary = "Get all channels from a server", description = "Retrieves a list of all channels from a server by the server's ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Channels retrieved"),
        @ApiResponse(responseCode = "404", description = "Server not found")
    })
    @GetMapping("/server/{serverId}/channel/")
    public ResponseEntity<GetAllChannelsFromServerResponse> getAllChannelsFromServer(@PathVariable(name = "serverId") Long serverId) {
        try {
            var response = channelService.getAllChannelsFromServer(serverId);
            return ResponseEntity.ok(response);
        } catch (NotFoundException notFoundException) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get a channel by ID", description = "Retrieves a channel by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Channel retrieved"),
        @ApiResponse(responseCode = "404", description = "Channel not found")
    })
    @GetMapping("/channel/{channelId}")
    public ResponseEntity<GetChannelResponse> getChannelById(@PathVariable(name = "channelId") Long channelId) {
        try {
            var response = channelService.getChannelById(channelId);
            return ResponseEntity.ok(response);
        } catch (NotFoundException notFoundException) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Create a new channel", description = "Creates a new channel with the provided name, position, type, and server ID")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Channel created"),
        @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    @PostMapping("/server/{serverId}/channel")
    public ResponseEntity<PostChannelResponse> createChannel(
        @PathVariable(name = "serverId") Long serverId, 
        @RequestBody PostChannelRequest request) {

        try {
            var response = channelService.createChannel(serverId, request);
            return ResponseEntity
                .created(UriComponentsBuilder.fromPath("/api/channel/{id}")
                .buildAndExpand(response.getId())
                .toUri())
                .body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
