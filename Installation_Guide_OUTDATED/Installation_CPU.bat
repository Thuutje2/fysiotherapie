@echo off


echo "Started Downloading the required files"
REM Set the URL of the zip file to download
set OPENPOSE_ZIP_URL=https://github.com/CMU-Perceptual-Computing-Lab/openpose/releases/download/v1.7.0/openpose-1.7.0-binaries-win64-cpu-python3.7-flir-3d.zip
@REM set TEST_ZIP_URL=https://github.com/DaanFrankhuizen/Portofolio/archive/refs/heads/main.zip

REM Set the name of the downloaded zip file
set ZIP_FILE=openpose-1.7.0-binaries-win64-gpu-python3.7-flir-3d_recommended.zip
@REM set ZIP_FILE=Portofolio.zip

REM Set the directory where you want to extract the contents of the zip file
set EXTRACT_DIR=./openpose

REM Download the zip file using curl
curl -# -o "%ZIP_FILE%" -L "%OPENPOSE_ZIP_URL%"

REM Check if the download was successful
if %errorlevel% neq 0 (
    echo Error downloading zip file.
    exit /b
) else (
    echo Zip file downloaded successfully.
)

REM Unzip the downloaded file
tar -xf "%ZIP_FILE%" -C "%EXTRACT_DIR%"

REM Check if the unzip operation was successful
if %errorlevel% neq 0 (
    echo Error extracting zip file.
    exit /b
)

echo Zip file downloaded and extracted successfully.

REM Remove the old .zip file
del "%ZIP_FILE%"

REM Download the extra files from dropbox
set DROPBOX_URL=https://www.dropbox.com/scl/fo/858b4wktpgvrp96g6dvzh/h?rlkey=68vwya20e9c64glqmhz2yhbfx&dl=0
set DROPBOX_FILE=extra_files.zip
set DROPBOX_EXTRACT_DIR=./extra_files

REM Download the extra files zip file using curl
curl -# -L -o "%DROPBOX_FILE%" -L "%DROPBOX_URL%"

REM Check if the download was successful
if %errorlevel% neq 0 (
    echo Error downloading extra files zip file.
    exit /b
) else (
    echo Extra files zip file downloaded successfully.
)

REM Unzip the downloaded extra files zip file
tar -xf "%DROPBOX_FILE%" -C "%DROPBOX_EXTRACT_DIR%"

REM Check if the unzip operation was successful
if %errorlevel% neq 0 (
    echo Error extracting extra files zip file.
    exit /b
)

echo Extra files zip file downloaded and extracted successfully.

REM Remove the old extra files .zip file
del "%DROPBOX_FILE%"


copy "%DROPBOX_EXTRACT_DIR%\face\pose_iter_116000.caffemodel" "%EXTRACT_DIR%\openpose\models\face"
copy "%DROPBOX_EXTRACT_DIR%\hand\pose_iter_102000.caffemodel" "%EXTRACT_DIR%\openpose\models\hand"
copy "%DROPBOX_EXTRACT_DIR%\hand\pose_iter_102000.caffemodel" "%EXTRACT_DIR%\openpose\models\pose\body_25"

echo "Finished Downloading the required files"

@echo off

REM Activate the conda environment
call C:\Users\daanf\anaconda3\Scripts\activate.bat

REM Create a new conda environment
@REM call conda create -n Pose2Sim python=3.8 -y

REM Activate the new conda environment
call conda activate Pose2Sim

REM Voer pip show pose2sim uit en filter de regel met "Location"
for /f "tokens=1,2 delims= " %%a in ('pip show pose2sim ^| findstr /C:"Location"') do (
    set "POSE2SIM_LOCATION=%%b"
    
)

echo %POSE2SIM_LOCATION%


call cd %POSE2SIM_LOCATION%\Pose2Sim\S00_Demo_Session\S00_P00_SingleParticipant

call ipython -c "from Pose2Sim import Pose2Sim; Pose2Sim.calibration(); Pose2Sim.personAssociation(); Pose2Sim.triangulation(); Pose2Sim.filtering(); Pose2Sim.markerAugmentation();"


echo "Finished running the Pose2Sim demo session"