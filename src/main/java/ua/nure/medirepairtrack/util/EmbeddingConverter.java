package ua.nure.medirepairtrack.util;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;

public class EmbeddingConverter {

    private EmbeddingConverter() {}

    public static byte[] toByteArray(List<Double> vector) {

        float[] floats = new float[vector.size()];

        for (int i = 0; i < vector.size(); i++) {
            floats[i] = vector.get(i).floatValue();
        }

        ByteBuffer buffer = ByteBuffer
                .allocate(floats.length * Float.BYTES)
                .order(ByteOrder.LITTLE_ENDIAN);

        for (float v : floats) {
            buffer.putFloat(v);
        }

        return buffer.array();
    }

    public static float[] fromByteArray(byte[] bytes) {

        ByteBuffer buffer = ByteBuffer
                .wrap(bytes)
                .order(ByteOrder.LITTLE_ENDIAN);

        float[] vector = new float[bytes.length / Float.BYTES];

        for (int i = 0; i < vector.length; i++) {
            vector[i] = buffer.getFloat();
        }

        return vector;
    }
}
