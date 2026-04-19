package net.kpuig.shoebill.backend.datamodels.server;

import java.net.URI;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostServerRequest {
    @NotBlank
    private String name;

    private URI image;
}
