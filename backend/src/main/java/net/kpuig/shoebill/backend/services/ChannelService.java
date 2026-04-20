package net.kpuig.shoebill.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.kpuig.shoebill.backend.datamodels.channel.Channel;
import net.kpuig.shoebill.backend.datamodels.channel.GetAllChannelsFromServerResponse;
import net.kpuig.shoebill.backend.datamodels.channel.GetChannelResponse;
import net.kpuig.shoebill.backend.datamodels.channel.PostChannelRequest;
import net.kpuig.shoebill.backend.datamodels.channel.PostChannelResponse;
import net.kpuig.shoebill.backend.datamodels.server.Server;
import net.kpuig.shoebill.backend.repositories.ChannelRepository;
import net.kpuig.shoebill.backend.repositories.ServerRepository;
import net.kpuig.shoebill.backend.services.exceptions.NotFoundException;

@Service
public class ChannelService {
    @Autowired private ChannelRepository channelRepository;
    @Autowired private ServerRepository serverRepository;

    public GetAllChannelsFromServerResponse getAllChannelsFromServer(Long serverId) {
        if (!serverRepository.existsById(serverId)) {
            throw new NotFoundException("Server not found");
        }
        var channels = channelRepository.findAllByServerId(serverId);
        var response = new GetAllChannelsFromServerResponse();
        response.setChannels(channels.stream().map(channel -> {
            var channelResponse = new GetChannelResponse();
            channelResponse.setId(channel.getId());
            channelResponse.setName(channel.getName());
            channelResponse.setPosition(channel.getPosition());
            channelResponse.setType(channel.getType());
            return channelResponse;
        }).toList());
        return response;
    }

    public GetChannelResponse getChannelById(Long channelId) {
        var channel = channelRepository.findById(channelId).orElseThrow();
        var response = new GetChannelResponse();
        response.setId(channel.getId());
        response.setName(channel.getName());
        response.setPosition(channel.getPosition());
        response.setType(channel.getType());
        return response;
    }

    public PostChannelResponse createChannel(Long serverId, PostChannelRequest request) {
        Server server;
        try {
            server = serverRepository.findById(serverId).orElseThrow();
        } catch (Exception e) {
            throw new RuntimeException("Server not found");
        }

        var channel = new Channel();
        channel.setName(request.getName());
        channel.setPosition(request.getPosition());
        channel.setType(request.getType());
        channel.setServer(server);
        channel = channelRepository.save(channel);

        var response = new PostChannelResponse();
        response.setId(channel.getId());
        response.setName(channel.getName());
        response.setPosition(channel.getPosition());
        response.setType(channel.getType());
        return response;
    }
}
