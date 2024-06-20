from Sports2D import Sports2D
import sys

def main():
    if len(sys.argv) < 2:
        print("Geef het pad naar de config file als argument")
        return
    
    config_path = sys.argv[1]

    # Voer de gewenste functies uit met het config_path
    Sports2D.detect_pose(config_path)
    Sports2D.compute_angles(config_path)

if __name__ == "__main__":
    main()