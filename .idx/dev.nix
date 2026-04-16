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
          # Simplified command for faster boot
          command = [ "npx" "cap" "run" "android" ];
          manager = "android";
        };
      };
   };
  };
}