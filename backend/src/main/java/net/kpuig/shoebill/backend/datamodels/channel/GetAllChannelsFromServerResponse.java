package net.kpuig.shoebill.backend.datamodels.channel;

import java.util.List;

import lombok.Data;

@Data
public class GetAllChannelsFromServerResponse {
    private List<GetChannelResponse> channels;
}
