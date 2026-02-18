package it.sitocamicie.service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;

public class SimpleImageEnhancer {
    public static void localEnhance(File in, File out, int size) throws Exception {
        BufferedImage src = ImageIO.read(in);
        int w = src.getWidth();
        int h = src.getHeight();
        double scale = Math.max((double)size/w, (double)size/h);
        int nw = (int)(w*scale);
        int nh = (int)(h*scale);
        Image tmp = src.getScaledInstance(nw, nh, Image.SCALE_SMOOTH);
        BufferedImage scaled = new BufferedImage(nw, nh, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = scaled.createGraphics();
        g.drawImage(tmp, 0, 0, null);
        g.dispose();

        // simple unsharp mask
        BufferedImage blur = new BufferedImage(nw, nh, BufferedImage.TYPE_INT_ARGB);
        Graphics2D gb = blur.createGraphics();
        gb.drawImage(scaled, 0, 0, null);
        gb.dispose();

        BufferedImage outImg = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D go = outImg.createGraphics();
        int cx = Math.max(0, (nw - size)/2);
        int cy = Math.max(0, (nh - size)/2);
        go.drawImage(scaled, 0, 0, size, size, cx, cy, cx+size, cy+size, null);
        go.dispose();

        ImageIO.write(outImg, "png", out);
    }
}
