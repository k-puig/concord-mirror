package net.kpuig.shoebill.backend.datamodels.channel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PostChannelRequest {
    @NotNull
    private Long position;

    @NotNull
    private ChannelType type;

    @NotBlank
    private String name;
}
