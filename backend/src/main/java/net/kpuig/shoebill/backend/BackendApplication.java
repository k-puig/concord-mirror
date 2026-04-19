package net.kpuig.shoebill.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import net.kpuig.shoebill.backend.config.ShoebillConfiguration;

@EnableConfigurationProperties(ShoebillConfiguration.class)
@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
