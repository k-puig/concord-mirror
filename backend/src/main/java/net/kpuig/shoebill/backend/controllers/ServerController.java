package net.kpuig.shoebill.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import net.kpuig.shoebill.backend.datamodels.server.GetAllServersResponse;
import net.kpuig.shoebill.backend.datamodels.server.GetServerResponse;
import net.kpuig.shoebill.backend.datamodels.server.PostServerRequest;
import net.kpuig.shoebill.backend.datamodels.server.PostServerResponse;
import net.kpuig.shoebill.backend.services.ServerService;
import net.kpuig.shoebill.backend.services.exceptions.BadRequestException;
import net.kpuig.shoebill.backend.services.exceptions.NotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api")
public class ServerController {
    @Autowired private ServerService serverService;

    @Operation(summary = "Get all servers", description = "Retrieves a list of all servers")
    @ApiResponse(responseCode = "200", description = "Servers retrieved")
    @GetMapping("/server")
    public ResponseEntity<GetAllServersResponse> getAllServers() {
        return ResponseEntity.ok(serverService.getAllServers());
    }

    @Operation(summary = "Get server by ID", description = "Retrieves a server by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Server retrieved"),
        @ApiResponse(responseCode = "404", description = "Server not found")
    })
    @GetMapping("/server/{id}")
    public ResponseEntity<GetServerResponse> getServerById(@PathVariable(name = "id") Long id) {
        try {
            return ResponseEntity.ok(serverService.getServerById(id));
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Create a new server", description = "Creates a new server with the provided name and image")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Server created"),
        @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    @PostMapping("/server")
    public ResponseEntity<PostServerResponse> createNewServer(@Valid @RequestBody PostServerRequest request) {
        try {
            var response = serverService.createServer(request);
            return ResponseEntity.ok(response);
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
}
