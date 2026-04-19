package net.kpuig.shoebill.backend.services;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.kpuig.shoebill.backend.config.ShoebillConfiguration;
import net.kpuig.shoebill.backend.datamodels.server.GetAllServersResponse;
import net.kpuig.shoebill.backend.datamodels.server.GetServerResponse;
import net.kpuig.shoebill.backend.datamodels.server.PostServerRequest;
import net.kpuig.shoebill.backend.datamodels.server.PostServerResponse;
import net.kpuig.shoebill.backend.datamodels.server.Server;
import net.kpuig.shoebill.backend.repositories.ServerRepository;
import net.kpuig.shoebill.backend.services.exceptions.BadRequestException;
import net.kpuig.shoebill.backend.services.exceptions.NotFoundException;

@Service
public class ServerService {
    @Autowired private ShoebillConfiguration shoebillConfiguration;
    @Autowired private ServerRepository serverRepository;

    public GetAllServersResponse getAllServers() {
        GetAllServersResponse response = new GetAllServersResponse();
        response.setServers(serverRepository.findAll().stream().map(server -> {
            GetServerResponse serverResponse = new GetServerResponse();
            serverResponse.setId(server.getId());
            serverResponse.setName(server.getName());
            serverResponse.setImage(server.getImage());
            return serverResponse;
        }).toList());
        return response;
    }

    public GetServerResponse getServerById(Long id) {
        GetServerResponse response = new GetServerResponse();
        serverRepository.findById(id).ifPresentOrElse(server -> {
            response.setId(server.getId());
            response.setName(server.getName());
            response.setImage(server.getImage());
        }, () -> {
            throw new NotFoundException("Server not found with id: " + id);
        });
        return response;
    }

    public PostServerResponse createServer(PostServerRequest request) {
        Server server = new Server();
        server.setName(request.getName());
        server.setImage(request.getImage());

        try {
            server = serverRepository.save(server);
            var uri = new URI(request.getImage().toString());
            
            // Make sure it's either relative with no injections or a complete HTTP/HTTPS URL
            if (uri.isAbsolute()) {
                if (shoebillConfiguration.relativePicturesOnly()) {
                    throw new BadRequestException("Only relative image URLs are allowed");
                }
                if (!uri.getScheme().equals("http") && !uri.getScheme().equals("https")) {
                    throw new BadRequestException("Image URL must be HTTP or HTTPS");
                }
            } else {
                if (request.getImage().toString().contains("..") || request.getImage().toString().contains("//") || request.getImage().toString().contains("\\")) {
                    throw new BadRequestException("Relative image URL cannot contain '..', '//', or '\\'");
                }
            }
        } catch (Exception e) {
            throw new BadRequestException("Invalid image URL");
        }

        PostServerResponse response = new PostServerResponse();
        response.setId(server.getId());
        response.setName(server.getName());
        response.setImage(server.getImage());
        return response;
    }
}
