package net.kpuig.shoebill.backend.datamodels.server;

import java.net.URI;

import lombok.Data;

@Data
public class GetServerResponse {
    private Long id;
    private String name;
    private URI image;
}
