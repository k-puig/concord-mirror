package net.kpuig.concord.backend.datamodels.userprofile;

import java.util.List;

import lombok.Data;

@Data
public class GetAllUserProfilesResponse {
    private List<GetUserProfileResponse> userProfiles;
}
