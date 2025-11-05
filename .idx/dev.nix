{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [ pkgs.nodejs_20 pkgs.python3 pkgs.pip-tools pkgs.gh ];
  env = {};
  idx = {
    extensions = [ "google.gemini-cli-vscode-ide-companion" ];
    workspace = {
      onCreate = {
        npm-install = "cd optimal-route-kl/frontend && npm i --no-audit --no-progress --timing";
        default.openFiles = [ "optimal-route-kl/frontend/src/App.jsx" ];
      };
    };
    previews = {
      enable = true;
      web = {
        command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
        workingDirectory = "optimal-route-kl/frontend";
        manager = "web";
      };
    };
  };
}
