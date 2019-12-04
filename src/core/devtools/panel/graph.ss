
            ;; PI
            (define PI 3.1415926535)
            (define 2PI (* 2 PI))
            (define PI/2 (/ PI 2))
            
            ;; vector
            (define make-vect cons)
            (define xcor-vect car)
            (define ycor-vect cdr)
            
            (define (add-vect v1 v2)
              (make-vect (+ (xcor-vect v1) (xcor-vect v2))
                         (+ (ycor-vect v1) (ycor-vect v2))))
            
            (define (sub-vect v1 v2)
              (make-vect (- (xcor-vect v1) (xcor-vect v2))
                         (- (ycor-vect v1) (ycor-vect v2))))
            
            (define (scale-vect s v)
              (make-vect (* s (xcor-vect v))
                         (* s (ycor-vect v))))
            
            (define (rot-vect v rad)
              (let ((c (cos rad))
                    (s (sin rad))
                    (x (xcor-vect v))
                    (y (ycor-vect v)))
                (make-vect (- (* x c) (* y s))
                           (+ (* y c) (* x s)))))
            
            ;; segment
            (define make-segment cons)
            (define start-segment car)
            (define end-segment cdr)
            
            (define (segments->painter segment-list)
              (lambda (frame)
                (for-each
                 (lambda (segment)
                   (draw-line
                    ((frame-coord-map frame) (start-segment segment))
                    ((frame-coord-map frame) (end-segment segment))))
                 segment-list)))
            
            ;; frame
            (define (make-frame origin edge1 edge2)
              (cons origin (cons edge1 edge2)))
            (define origin-frame car)
            (define edge1-frame cadr)
            (define edge2-frame cddr)
            
            (define (frame-coord-map frame)
              (lambda (v)
                (add-vect
                 (origin-frame frame)
                 (add-vect (scale-vect (xcor-vect v)
                                       (edge1-frame frame))
                           (scale-vect (ycor-vect v)
                                       (edge2-frame frame))))))
            
            ;; draw-line
            (define (draw-line v0 v1)
              ($line v0 v1))
            
            
            ;; sample painters
            (define %line
              (segments->painter
               (list (make-segment (make-vect 0 0) (make-vect 1 0)))))
            
            (define %box
              (lambda (frame)
                (let ((m (frame-coord-map frame)))
                  ($poly (m (make-vect 0 0))
                         (m (make-vect 1 0))
                         (m (make-vect 1 1))
                         (m (make-vect 0 1))))))
            
            (define %circle
              (lambda (frame)
                (let ((o (origin-frame frame))
                      (e1 (edge1-frame frame))
                      (e2 (edge2-frame frame)))
                  ($circle-fill (xcor-vect o) (ycor-vect o)
                                (xcor-vect e1) (ycor-vect e1)
                                (xcor-vect e2) (ycor-vect e2)))))
            
            (define %image
              (lambda (frame)
                (let ((o (origin-frame frame))
                      (e1 (edge1-frame frame))
                      (e2 (edge2-frame frame)))
                  ($transform-image (xcor-vect o)  (ycor-vect o)
                                    (xcor-vect e1) (ycor-vect e1)
                                    (xcor-vect e2) (ycor-vect e2)))))
            
            
            ;; Render to canvas
            (define (canvas-x x)
              (* x *canvas-width*))
            
            (define (canvas-y y)
              (* (- 1 y) *canvas-height*))
            
            (define (canvas-vx x) (* x *canvas-width*))
            (define (canvas-vy y) (* y *canvas-height*))
            
            (define ($color r g b . args)
              (let ((col (if (null? args)
                             (string-append "rgb("
                                            (number->string r)
                                            ","
                                            (number->string g)
                                            ","
                                            (number->string b)
                                            ")")
                           (string-append "rgba("
                                          (number->string r)
                                          ","
                                          (number->string g)
                                          ","
                                          (number->string b)
                                          ","
                                          (number->string (car args))
                                          ")"))))
                (js-set! *ctx* "fillStyle" col)
                (js-set! *ctx* "strokeStyle" col)))
            
            (define ($save-ctx)
              (js-invoke *ctx* "save"))
            
            (define ($restore-ctx)
              (js-invoke *ctx* "restore"))
            
            (define ($line v0 . args)
              (js-invoke *ctx* "beginPath")
              (js-invoke *ctx* "moveTo" (canvas-x (xcor-vect v0)) (canvas-y (ycor-vect v0)))
              (for-each (lambda (v)
                          (js-invoke *ctx* "lineTo" (canvas-x (xcor-vect v)) (canvas-y (ycor-vect v))))
                        args)
              (js-invoke *ctx* "stroke"))
            
            (define ($poly . args)
              (js-invoke *ctx* "beginPath")
              (let ((v (car args)))
                (js-invoke *ctx* "moveTo" (canvas-x (xcor-vect v)) (canvas-y (ycor-vect v))))
              (for-each (lambda (v)
                          (js-invoke *ctx* "lineTo" (canvas-x (xcor-vect v)) (canvas-y (ycor-vect v))))
                        (cdr args))
              (js-invoke *ctx* "closePath")
              (js-invoke *ctx* "fill"))
            
            (define ($circle orig-x orig-y edge1-x edge1-y edge2-x edge2-y)
              (js-invoke *ctx* "beginPath")
              (js-invoke *ctx* "save")
              (js-invoke *ctx* "transform"
                         (canvas-vx edge1-x)     (- (canvas-vy edge1-y))
                         (- (canvas-vx edge2-x)) (canvas-vy edge2-y)
                         (canvas-x (+ orig-x edge2-x)) (canvas-y (+ orig-y edge2-y)))
              (js-invoke *ctx* "arc" (canvas-x x) (canvas-y y) (canvas-x r) 0 2PI)
              (js-invoke *ctx* "stroke")
              (js-invoke *ctx* "restore"))
            
            (define ($circle-fill orig-x orig-y edge1-x edge1-y edge2-x edge2-y)
              (js-invoke *ctx* "beginPath")
              (js-invoke *ctx* "save")
              (js-invoke *ctx* "transform"
                         (canvas-vx edge1-x)     (- (canvas-vy edge1-y))
                         (- (canvas-vx edge2-x)) (canvas-vy edge2-y)
                         (canvas-x (+ orig-x edge2-x)) (canvas-y (+ orig-y edge2-y)))
              (js-invoke *ctx* "arc" 0.5 0.5 0.5 0 2PI)
              (js-invoke *ctx* "fill")
              (js-invoke *ctx* "restore"))
            
            (define ($arc-fill orig-x orig-y edge1-x edge1-y edge2-x edge2-y ang1 ang2)
              (js-invoke *ctx* "beginPath")
              (js-invoke *ctx* "save")
              (js-invoke *ctx* "transform"
                         (canvas-vx edge1-x)     (- (canvas-vy edge1-y))
                         (- (canvas-vx edge2-x)) (canvas-vy edge2-y)
                         (canvas-x (+ orig-x edge2-x)) (canvas-y (+ orig-y edge2-y)))
              (js-invoke *ctx* "arc" 0.5 0.5 0.5 ang1 ang2)
              (js-invoke *ctx* "lineTo" 0.5 0.5)
              (js-invoke *ctx* "fill")
              (js-invoke *ctx* "restore"))
            
            (define ($draw-image x0 y0 x1 y1)
              (let ((img (dom-element "#img1"))
                    (cx0 (canvas-x x0))
                    (cy0 (canvas-y y0))
                    (cx1 (canvas-x x1))
                    (cy1 (canvas-y y1)))
                (js-invoke *ctx* "drawImage" img cx0 cy1 (- cx1 cx0) (- cy0 cy1))))
            
            (define ($transform-image orig-x orig-y edge1-x edge1-y edge2-x edge2-y)
              (if (and (> edge1-x 0) (zero? edge1-y)
                       (> edge2-y 0) (zero? edge2-x))
                  ($draw-image orig-x orig-y (+ orig-x edge1-x) (+ orig-y edge2-y))
                (let ((img (dom-element "#img1")))
                  (let ((imgw (js-ref img "width"))
                        (imgh (js-ref img "height")))
                    (js-invoke *ctx* "save")
                    (js-invoke *ctx* "transform"
                               (/ (canvas-vx edge1-x) imgw)     (- (/ (canvas-vy edge1-y) imgh))
                               (- (/ (canvas-vx edge2-x) imgw)) (/ (canvas-vy edge2-y) imgh)
                               (canvas-x (+ orig-x edge2-x))    (canvas-y (+ orig-y edge2-y)))
                    (js-invoke *ctx* "drawImage" img 0 0)
                    (js-invoke *ctx* "restore")))))
            
            
            ;;;;
            (define *canvas* (dom-element "#canvassample"))
            (define *ctx* (js-invoke *canvas* "getContext" "2d"))
            (define *canvas-width* 384)
            (define *canvas-height* 384)
            
            (define *frame*
              (make-frame (make-vect 0 0)
                          (make-vect 1 0)
                          (make-vect 0 1)))
            
            ;;(load "pictlang.scm")
