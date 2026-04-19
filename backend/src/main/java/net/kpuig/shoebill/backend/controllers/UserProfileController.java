package net.kpuig.shoebill.backend.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import net.kpuig.shoebill.backend.datamodels.userprofile.GetAllUserProfilesResponse;
import net.kpuig.shoebill.backend.datamodels.userprofile.GetUserProfileResponse;
import net.kpuig.shoebill.backend.datamodels.userprofile.PostUserProfileRequest;
import net.kpuig.shoebill.backend.datamodels.userprofile.PostUserProfileResponse;
import net.kpuig.shoebill.backend.services.UserProfileService;
import net.kpuig.shoebill.backend.services.exceptions.BadRequestException;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileController {
    @Autowired
    private UserProfileService userProfileService;

    @Operation(summary = "Get all user profiles", description = "Retrieves a list of all user profiles")
    @ApiResponse(responseCode = "200", description = "User profiles retrieved",
        content = { @Content(mediaType = "application/json") })
    @GetMapping("/")
    public ResponseEntity<GetAllUserProfilesResponse> getAllUserProfiles() {
        return ResponseEntity.ok(userProfileService.getAllUserProfiles());
    }

    @Operation(summary = "Get user profile by ID or username", description = "Retrieves a user profile by its ID or username")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User profile retrieved",
            content = { @Content(mediaType = "application/json") }),
        @ApiResponse(responseCode = "404", description = "User profile not found")
    })
    @GetMapping("")
    public ResponseEntity<GetUserProfileResponse> getUserProfileById(
        @RequestParam(name = "id", required = false) Long id, 
        @RequestParam(name = "username", required = false) String username) {
        if (id == null && username == null) { // Must provide at least one of them
            return ResponseEntity.badRequest().build();
        } else if (id != null && username != null) { // Both have been provided
            return ResponseEntity.badRequest().build();
        } else if (id != null) { // ID has been provided
            try {
                var response = userProfileService.getUserProfileById(id);
                return ResponseEntity.ok(response);
            } catch (NumberFormatException e) {
                return ResponseEntity.notFound().build();
            }
        } else { // Username has been provided
            try {
                var response = userProfileService.getUserProfileByUsername(username);
                return ResponseEntity.ok(response);
            } catch (NumberFormatException e) {
                return ResponseEntity.notFound().build();
            }
        }
    }

    @Operation(summary = "Create user profile", description = "Creates a new user profile")
    @ApiResponse(responseCode = "201", description = "User profile created",
        content = { @Content(mediaType = "application/json") })
    @PostMapping("/")
    public ResponseEntity<PostUserProfileResponse> createUserProfile(@RequestBody @Valid PostUserProfileRequest request) {
        try {
            var response = userProfileService.createUserProfile(request.getUsername());
            URI location = UriComponentsBuilder
                .fromPath("/user-profile")
                .queryParam("username", response.getUsername())
                .build()
                .encode()
                .toUri();
            return ResponseEntity.created(location).body(response);
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
