package it.sitocamicie.service;

import org.bytedeco.opencv.global.opencv_core;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;

import java.nio.file.Path;

public class OpenCVUtils {

    // simple function: read image, resize, seamlessClone-like tiling using OpenCV's seamlessClone is not ideal for textures,
    // so we synthesize a tile by blending shifted copies and applying Gaussian blur at seams.
    public static void generateTiled(String inputPath, String outputPath, int size) {
        Mat img = opencv_imgcodecs.imread(inputPath, opencv_imgcodecs.IMREAD_UNCHANGED);
        if (img == null || img.empty()) return;
        Mat resized = new Mat();
        double sx = (double) size / img.cols();
        double sy = (double) size / img.rows();
        double scale = Math.max(sx, sy);
        opencv_imgproc.resize(img, resized, new org.bytedeco.opencv.opencv_core.Size((int)(img.cols()*scale), (int)(img.rows()*scale)));

        // create canvas and tile
        Mat canvas = new Mat(size, size, resized.type());
        int w = resized.cols();
        int h = resized.rows();
        for (int ix=-1; ix<=1; ix++) {
            for (int iy=-1; iy<=1; iy++) {
                int dx = (size - w)/2 + ix*w;
                int dy = (size - h)/2 + iy*h;
                Mat roi = canvas.apply(new org.bytedeco.opencv.opencv_core.Rect(Math.max(0,dx), Math.max(0,dy), Math.min(w, size - Math.max(0,dx)), Math.min(h, size - Math.max(0,dy))));
                Mat srcRoi = resized.apply(new org.bytedeco.opencv.opencv_core.Rect(Math.max(0,-dx), Math.max(0,-dy), roi.cols(), roi.rows()));
                srcRoi.copyTo(roi);
            }
        }

        // blur seams
        opencv_imgproc.GaussianBlur(canvas, canvas, new org.bytedeco.opencv.opencv_core.Size(9,9), 0);
        opencv_imgcodecs.imwrite(outputPath, canvas);
        img.release(); resized.release(); canvas.release();
    }
}
