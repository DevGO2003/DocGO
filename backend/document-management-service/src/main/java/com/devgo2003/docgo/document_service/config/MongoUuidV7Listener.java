package com.devgo2003.docgo.document_service.config;

import com.github.f4b6a3.uuid.UuidCreator;
import org.bson.Document;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;
import java.lang.reflect.Field;

@Component
@Configuration
public class MongoUuidV7Listener extends AbstractMongoEventListener<Object> {

    @Override
    public void onBeforeConvert(BeforeConvertEvent<Object> event) {
        Object source = event.getSource();
        try {
            Field idField = null;
            Class<?> clazz = source.getClass();
            while (clazz != null) {
                try {
                    idField = clazz.getDeclaredField("id");
                    break;
                } catch (NoSuchFieldException e) {
                    clazz = clazz.getSuperclass();
                }
            }
            if (idField != null) {
                idField.setAccessible(true);
                Object currentId = idField.get(source);
                if (currentId == null || (currentId instanceof String && ((String) currentId).isBlank())) {
                    String uuidv7 = UuidCreator.getTimeOrderedEpoch().toString();
                    idField.set(source, uuidv7);
                }
            }
        } catch (Exception ignored) {
        }
    }
}
