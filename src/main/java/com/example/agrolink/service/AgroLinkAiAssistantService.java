package com.example.agrolink.service;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.agrolink.dto.AiChatDTO;
import com.example.agrolink.dto.AiChatMessageDTO;

@Service
public class AgroLinkAiAssistantService {

    private static final Logger logger = LoggerFactory.getLogger(AgroLinkAiAssistantService.class);

    public AiChatDTO processChat(AiChatDTO request) {
        String msg = request.getMessage() != null ? request.getMessage().trim() : "";
        String lang = request.getLanguage() != null ? request.getLanguage().toUpperCase() : "EN";
        String district = request.getDistrict() != null ? request.getDistrict() : "Matale";
        Integer ageDays = request.getPlantAgeDays();

        logger.info("Processing AgroLink AI Chat in language: {}, message: {}", lang, msg);

        String aiReply;
        boolean requiresExpert = false;

        String lower = msg.toLowerCase();
        boolean mentionsYellowing = lower.contains("yellow") || lower.contains("කහ") || lower.contains("மஞ்சள்");

        if (mentionsYellowing && (ageDays == null || ageDays <= 0)) {
            switch (lang) {
                case "SI":
                    aiReply = "කරුණාකර ඡායාරූපයක් උඩුගත කර ඔබගේ දිස්ත්‍රික්කය සහ පැලවල වයස (දින ගණන) සඳහන් කරන්න.";
                    break;
                case "TA":
                    aiReply = "தயவுசெய்து ஒரு புகைப்படத்தைப் பதிவேற்றி உங்கள் மாவட்டத்தையும் தாவரங்களின் வயதையும் கூறுங்கள்.";
                    break;
                default:
                    aiReply = "Upload a photo and tell me your district and the age of the plants.";
                    break;
            }
        } else if (mentionsYellowing || (ageDays != null && ageDays > 0)) {
            requiresExpert = true;
            int days = (ageDays != null && ageDays > 0) ? ageDays : 45;

            switch (lang) {
                case "SI":
                    aiReply = String.format(
                            "ඔබගේ තොරතුරු අනුව (දිස්ත්‍රික්කය: %s, වයස: දින %d), තක්කාලි කොළ කහ වීම නයිට්‍රජන් ඌනතාවය හෝ අධික තෙතමනය නිසා ඇතිවන Solanaceae දිලීර ආසාදනයක් (Early Blight) විය හැක. නිර්දේශය: NPK 15-15-15 පොහොර හෝ තඹ අඩංගු දිලීර නාශක යොදන්න. සහතික ලත් කෘෂිකාර්මික නිලධාරියෙකු (ROLE_EXPERT) ලවා මෙය තහවුරු කර ගැනීමට අපි නිර්දේශ කරමු.",
                            district, days
                    );
                    break;
                case "TA":
                    aiReply = String.format(
                            "உங்கள் தகவலின் அடிப்படையில் (மாவட்டம்: %s, வயது: %d நாட்கள்), தக்காளி இலைகள் மஞ்சளாவதற்கு நைட்ரஜன் குறைபாடு அல்லது பூஞ்சை தொற்று காரணமாக இருக்கலாம். பரிந்துரை: NPK உரம் அல்லது செம்பு பூஞ்சைக் கொல்லியைப் பயன்படுத்தவும். சான்றளிக்கப்பட்ட விவசாய அதிகாரியுடன் (ROLE_EXPERT) இதை உறுதிப்படுத்த பரிந்துரைக்கிறோம்.",
                            district, days
                    );
                    break;
                default:
                    aiReply = String.format(
                            "Based on your details (District: %s, Plant Age: %d days), yellowing tomato leaves typically indicate Nitrogen deficiency or Solanaceae Early Blight fungal infection due to high humidity. Recommendation: Apply NPK 15-15-15 fertilizer or copper-based bio-fungicide. We recommend professional confirmation with certified Agricultural Officers (ROLE_EXPERT).",
                            district, days
                    );
                    break;
            }
        } else {
            switch (lang) {
                case "SI":
                    aiReply = "ආයුබෝවන්! මම ඇග්‍රෝලින්ක් AI උපදේශක වෙමි. ඔබගේ වගා ගැටලු, දිස්ත්‍රික්කය සහ පළිබෝධ රෝග පිළිබඳ ඕනෑම දෙයක් විමසන්න.";
                    break;
                case "TA":
                    aiReply = "வணக்கம்! நான் அக்ரோலின்க் AI உதவி அதிகாரி. உங்கள் பயிர் பிரச்சனைகள் மற்றும் உர ஆலோசனைகளைப் பற்றி என்னிடம் கேட்கலாம்.";
                    break;
                default:
                    aiReply = "Hello! I am AgroLink AI Assistant. Ask me anything about crop diseases, soil nutrients, weather risks, or market prices in Sri Lanka.";
                    break;
            }
        }

        List<AiChatMessageDTO> messages = new ArrayList<>();
        messages.add(new AiChatMessageDTO("USER", msg, "Just now"));
        messages.add(new AiChatMessageDTO("AI", aiReply, "Just now"));

        return new AiChatDTO(
                msg,
                lang,
                district,
                ageDays,
                request.getImageUrl(),
                request.getCropName() != null ? request.getCropName() : "Tomato",
                messages,
                aiReply,
                requiresExpert
        );
    }
}
