package net.kpuig.shoebill.backend.datamodels.userprofile;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostUserProfileRequest {
    @NotBlank
    private String username;
}
