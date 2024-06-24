@echo off
cd C:\Users\daanf\code\TODSS\Github\fysiotherapie\fysiotherapie-frontend\uploads

call C:\Users\daanf\anaconda3\Scripts\activate.bat

@REM call conda clean --all -y
call conda create -n Sports2D python=3.10 -y
call conda activate Sports2D
call pip install sports2d

ipython -c "from Sports2D import Sports2D; Sports2D.detect_pose('Config.toml'); Sports2D.compute_angles('Config.toml')"

