use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};
use std::net::SocketAddr;
use tokio::sync::broadcast;

pub async fn start_websocket_server() {
    // 启动服务器
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("WebSocket server running on ws://{}", &addr);
    // 创建一个广播通道用于消息传递
    let (tx, _rx) = broadcast::channel::<String>(16);

    // 定义 WebSocket 处理函数
    let app = Router::new().route("/ws", get(ws_handler));

    axum_server::bind(addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket))
}

async fn handle_socket(mut socket: WebSocket) {
    // 处理 WebSocket 消息
    while let Some(msg) = socket.recv().await {
        match msg {
            Ok(Message::Text(text)) => {
                println!("Received text: {}", text);
                // 你可以在这里处理接收到的消息
            }
            Ok(Message::Binary(bin)) => {
                println!("Received binary data: {:?}", bin);
                // 你可以在这里处理接收到的二进制数据
            }
            Ok(Message::Close(_)) => {
                println!("Client disconnected");
                break;
            }
            _ => {}
        }
    }
}
