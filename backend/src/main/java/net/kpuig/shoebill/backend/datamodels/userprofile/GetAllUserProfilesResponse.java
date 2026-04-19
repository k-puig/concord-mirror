package net.kpuig.shoebill.backend.datamodels.userprofile;

import java.util.List;

import lombok.Data;

@Data
public class GetAllUserProfilesResponse {
    private List<GetUserProfileResponse> userProfiles;
}
