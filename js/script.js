//設定初期化
Quagga.init({
    inputStream : {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#cameraArea'), //カメラ映像表示場所 ID 指定（html側）
        constraints: {
            facingMode: "environment",
            frameRate: 60, //フレームレート:60fps
            width: 640, //横幅:640
            height: 480 //縦幅:480
        }
    },
    decoder: { //デコーダ
        readers: ["ean_reader"] //リーダーモード:EAN
    },
    frequency: 10, //1秒あたりの最大スキャン数
},
function (err) {// エラー時
    if (err) {
        console.log(err); // エラー内容をログ出力
        return
    }
    // エラー未検知時
    console.log("〔初期化完了〕開始する準備ができました");
    // スキャン開始
    Quagga.start();
});

// バーコード検知時
// ↓ここから↓ LINE上で動くバーコードリーダーを作った【Qiita】 https://qiita.com/kaonaga9/items/6a4448253d340cb99802
Quagga.onProcessed(
    function (result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;
        if (result) {
            // 認識したバーコードを囲む
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {
                        x: 0,
                        y: 1
                    }, drawingCtx, {
                        color: "white",
                        lineWidth: 2
                    });
                });
            }
            // 読み取ったバーコードを囲む
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {
                    x: 0,
                    y: 1
                }, drawingCtx, {
                    color: "#01f965",
                    lineWidth: 2
                });
            }
            // 読み取ったバーコードに線を引く
            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {
                    x: 'x',
                    y: 'y'
                },drawingCtx, {
                    color: '#00b900',
                    lineWidth: 2
                });
            }
        }
    }
);
// ↓ここまで↓

//
Quagga.onDetected (
    function (result) {
        readResult.innerHTML = result;
    }
);
