package net.kpuig.concord.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.kpuig.concord.backend.datamodels.userprofile.GetAllUserProfilesResponse;
import net.kpuig.concord.backend.datamodels.userprofile.GetUserProfileResponse;
import net.kpuig.concord.backend.repositories.UserProfileRepository;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    public GetAllUserProfilesResponse getAllUserProfiles() {
        GetAllUserProfilesResponse response = new GetAllUserProfilesResponse();
        response.setUserProfiles(userProfileRepository.findAll().stream().map(userProfile -> {
            GetUserProfileResponse userProfileResponse = new GetUserProfileResponse();
            userProfileResponse.setId(userProfile.getId());
            userProfileResponse.setUsername(userProfile.getUsername());
            return userProfileResponse;
        }).toList());
        return response;
    }

    public GetUserProfileResponse getUserProfile(String id) {
        GetUserProfileResponse response = new GetUserProfileResponse();
        userProfileRepository.findById(Long.parseLong(id)).ifPresent(userProfile -> {
            response.setId(userProfile.getId());
            response.setUsername(userProfile.getUsername());
        });
        return response;
    }
}
