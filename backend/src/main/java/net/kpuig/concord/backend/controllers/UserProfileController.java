package net.kpuig.concord.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;

import net.kpuig.concord.backend.datamodels.userprofile.GetAllUserProfilesResponse;
import net.kpuig.concord.backend.datamodels.userprofile.GetUserProfileResponse;
import net.kpuig.concord.backend.services.UserProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/user-profile")
public class UserProfileController {
    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/")
    public GetAllUserProfilesResponse getAllUserProfiles() {
        return userProfileService.getAllUserProfiles();
    }

    @GetMapping("/{id}")
    public GetUserProfileResponse getMethodName(@RequestParam String id) {
        return userProfileService.getUserProfile(id);
    }
    
}
