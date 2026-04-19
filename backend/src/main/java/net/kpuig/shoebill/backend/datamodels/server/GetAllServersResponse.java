package net.kpuig.shoebill.backend.datamodels.server;

import java.util.List;

import lombok.Data;

@Data
public class GetAllServersResponse {
    private List<GetServerResponse> servers;
}
