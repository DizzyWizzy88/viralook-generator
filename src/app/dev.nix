{ pkgs, ... }: {
  channel = "stable-24.11"; 
  
  packages = [
    pkgs.nodejs_20
    pkgs.jdk17
    pkgs.unzip
  ];

  idx = {
    extensions = [
      "ms-vscode.vscode-typescript-next"
    ];
    
    previews = {
      enable = true;
      previews = {
        android = {
          # Notice: No commas between the strings below
          command = [ "npx" "cap" "run" "android" "--target" "emulator-5554" ];
          manager = "android";
        };
      };
    };
  };
}