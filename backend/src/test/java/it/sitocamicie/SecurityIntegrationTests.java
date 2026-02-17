package it.sitocamicie;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityIntegrationTests {

    @Autowired
    MockMvc mockMvc;

    @Test
    void publicGetModelsAllowed() throws Exception {
        mockMvc.perform(get("/api/models")).andExpect(status().isOk());
    }

    @Test
    void postModelRequiresAuth() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.glb", "model/gltf-binary", "data".getBytes());
        mockMvc.perform(multipart("/api/models").file(file).param("name","t").param("componentType","COLLAR"))
                .andExpect(status().isForbidden());
    }

    @Test
    void loginAndPostModel() throws Exception {
        // login
        var loginRes = mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content("{\"username\":\"admin\",\"password\":\"admin\"}"))
                .andExpect(status().isOk())
                .andReturn();

        String content = loginRes.getResponse().getContentAsString();
        com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(content);
        String token = node.get("token").asText();

        MockMultipartFile file = new MockMultipartFile("file", "test.glb", "model/gltf-binary", "data".getBytes());
        mockMvc.perform(multipart("/api/models").file(file).param("name","t").param("componentType","COLLAR").header("Authorization","Bearer " + token))
                .andExpect(status().isOk());
    }
}
