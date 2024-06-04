{ pkgs ? import <nixos> {} }:

pkgs.mkShell {
    buildInputs = with pkgs; [
        pkg-config
        openssl
        # openssl.dev
        # stdenv.cc.cc.lib
    ];

    # PKG_CONFIG_PATH = "/nix/store/k4qbkbspinxrzsbx7zh2vnhwpbc2rr0d-openssl-3.0.13-dev/lib/pkgconfig";
    # OPENSSL_NO_VENDOR = 1;

    shellHook = ''
        # zsh
    '';
}
