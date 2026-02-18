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

    public static void enhanceLocal(String inputPath, String outputPath, int targetSize) {
        Mat img = opencv_imgcodecs.imread(inputPath, opencv_imgcodecs.IMREAD_UNCHANGED);
        if (img == null || img.empty()) return;
        Mat resized = new Mat();
        double sx = (double) targetSize / img.cols();
        double sy = (double) targetSize / img.rows();
        double scale = Math.max(sx, sy);
        opencv_imgproc.resize(img, resized, new org.bytedeco.opencv.opencv_core.Size((int)(img.cols()*scale), (int)(img.rows()*scale)), 0, 0, opencv_imgproc.INTER_CUBIC);

        Mat tmp = new Mat();
        // bilateral filter to denoise while preserving edges
        opencv_imgproc.bilateralFilter(resized, tmp, 9, 75, 75);
        Mat unsharp = new Mat();
        // unsharp mask: sharpen = 1.5*resized - 0.5*blur
        Mat blur = new Mat();
        opencv_imgproc.GaussianBlur(tmp, blur, new org.bytedeco.opencv.opencv_core.Size(5,5), 0);
        opencv_core.addWeighted(tmp, 1.5, blur, -0.5, 0.0, unsharp);

        // center-crop to targetSize
        int cx = Math.max(0, (unsharp.cols() - targetSize)/2);
        int cy = Math.max(0, (unsharp.rows() - targetSize)/2);
        org.bytedeco.opencv.opencv_core.Rect rect = new org.bytedeco.opencv.opencv_core.Rect(cx, cy, Math.min(targetSize, unsharp.cols()), Math.min(targetSize, unsharp.rows()));
        Mat out = new Mat(unsharp, rect);
        opencv_imgcodecs.imwrite(outputPath, out);

        img.release(); resized.release(); tmp.release(); blur.release(); unsharp.release(); out.release();
    }
}
