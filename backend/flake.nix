{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            jdk25
            gradle
          ];
        shellHook = ''
          mkdir -p .vscode

          cat <<EOF > .vscode/settings.json
          {
            "java.compile.nullAnalysis.mode": "disabled",
            "gradle.reuseTerminals": "all",
            "java.import.gradle.java.home": "${pkgs.jdk25}/lib/openjdk",
            "java.import.gradle.home": "${pkgs.gradle}/libexec/gradle",
            "java.import.gradle.wrapper.enabled": false
          }
          EOF


          echo Java Flake development environment ready!
        '';
        };
      }
    );
}
