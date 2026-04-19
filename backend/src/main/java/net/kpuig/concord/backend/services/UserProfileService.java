package net.kpuig.concord.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.kpuig.concord.backend.datamodels.userprofile.GetAllUserProfilesResponse;
import net.kpuig.concord.backend.datamodels.userprofile.GetUserProfileResponse;
import net.kpuig.concord.backend.datamodels.userprofile.PostUserProfileResponse;
import net.kpuig.concord.backend.datamodels.userprofile.UserProfile;
import net.kpuig.concord.backend.repositories.UserProfileRepository;
import net.kpuig.concord.backend.services.exceptions.BadRequestException;

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

    public GetUserProfileResponse getUserProfileById(Long id) {
        GetUserProfileResponse response = new GetUserProfileResponse();
        userProfileRepository.findById(id).ifPresentOrElse(userProfile -> {
            response.setId(userProfile.getId());
            response.setUsername(userProfile.getUsername());
        }, () -> {
            throw new net.kpuig.concord.backend.services.exceptions.NotFoundException("User profile not found");
        });
        return response;
    }

    public GetUserProfileResponse getUserProfileByUsername(String username) {
        GetUserProfileResponse response = new GetUserProfileResponse();
        userProfileRepository.findByUsername(username).ifPresentOrElse(userProfile -> {
            response.setId(userProfile.getId());
            response.setUsername(userProfile.getUsername());
        }, () -> {
            throw new net.kpuig.concord.backend.services.exceptions.NotFoundException("User profile not found");
        });
        return response;
    }

    public PostUserProfileResponse createUserProfile(String username) {
        if (userProfileRepository.findByUsername(username).isPresent()) {
            throw new BadRequestException("Username is already taken");
        }

        UserProfile userProfile = new UserProfile();
        userProfile.setUsername(username);
        userProfile = userProfileRepository.save(userProfile);

        PostUserProfileResponse response = new PostUserProfileResponse();
        response.setId(userProfile.getId());
        response.setUsername(userProfile.getUsername());

        return response;
    }

}
