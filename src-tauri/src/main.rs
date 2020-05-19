#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;

use serde::Serialize;

#[derive(Serialize, Debug)]
struct Reply {
  data: String,
}
fn to_u32(v: &str) -> Result<u32, std::num::ParseIntError> {
  v.parse::<u32>()
}
fn main() {
  tauri::AppBuilder::new()
    .setup(|webview, _source| {
      let handle = webview.handle();
      tauri::event::listen(String::from("js-event"), move |msg| {
        println!("got js-event with message '{:?}'", msg);
        if let Some(num) = msg {
          match to_u32(&num) {
            Ok(t) => {
              let t = t + 1;
              let reply = Reply {
                data: t.to_string(),
              };
              println!("{:?}", reply);

              tauri::event::emit(
                &handle,
                String::from("rust-event"),
                Some(serde_json::to_string(&reply).unwrap()),
              );
            }
            Err(e) => println!("{}", e),
          }
        }
      });

      webview.eval("window.onTauriInit()").unwrap();
    })
    .invoke_handler(|_webview, arg| {
      use cmd::Cmd::*;
      match serde_json::from_str(arg) {
        Err(e) => Err(e.to_string()),
        Ok(command) => {
          match command {
            LogOperation { event, payload } => {
              println!("{} {:?}", event, payload);
            }
            PerformRequest {
              endpoint,
              body,
              callback,
              error,
            } => {
              // tauri::execute_promise is a helper for APIs that uses the tauri.promisified JS function
              // so you can easily communicate between JS and Rust with promises
              tauri::execute_promise(
                _webview,
                move || {
                  println!("{} {:?}", endpoint, body);
                  // perform an async operation here
                  // if the returned value is Ok, the promise will be resolved with its value
                  // if the returned value is Err, the promise will be rejected with its value
                  // the value is a string that will be eval'd
                  Ok("{ key: 'response', value: [{ id: 3 }] }".to_string())
                },
                callback,
                error,
              )
            }
          }
          Ok(())
        }
      }
    })
    .build()
    .run();
}
