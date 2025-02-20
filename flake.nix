{
  description = "A Nix-flake-based development environment for johnny-customs";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self , nixpkgs ,... }: let
    system = "x86_64-linux";
  in {
    devShells."${system}".default = let
      pkgs = import nixpkgs {
        inherit system;
      };
    in pkgs.mkShell {
      packages = with pkgs; [
        nodejs
        typescript-language-server
        yarn
          
      ];

      shellHook = ''
        echo "Node `${pkgs.nodejs}/bin/node --version`"
        echo "NPM `${pkgs.nodejs}/bin/npm --version`"
      '';
    };
  };
}
