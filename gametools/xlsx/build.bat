
:放在D盘下了
d:
cd %cd%

:数据目录
set data_path=D:\work\sarsgame\CrossFrameWorkDemo\gametools\game\

:项目目录
set project_path=D:\work\sarsgame\CrossFrameWorkDemo\CrossFrameWorkDemo\

node read_all.js game %data_path%data\ %data_path%export\ %project_path%assets\resources\data\ %project_path%assets\Script\public\
pause