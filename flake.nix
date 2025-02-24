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
        openssl
        nodePackages_latest.prisma
          
      ];
      env = {
        PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
        PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
        PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
        DB_FILE_NAME= "file:local.db";
      };

      shellHook = ''
        echo "node `${pkgs.nodejs}/bin/node --version`"
        echo "yarn `${pkgs.yarn}/bin/yarn --version`"
      '';
    };
  };
}
