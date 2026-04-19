package net.kpuig.shoebill.backend.datamodels.server;

import java.net.URI;

import lombok.Data;

@Data
public class PostServerResponse {
    private Long id;
    private String name;
    private URI image;
}
