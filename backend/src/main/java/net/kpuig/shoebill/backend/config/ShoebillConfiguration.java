package net.kpuig.shoebill.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "shoebill")
@Validated
public record ShoebillConfiguration (
    @DefaultValue("false")
    boolean relativePicturesOnly
) {
    
}
