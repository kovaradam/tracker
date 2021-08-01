let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/AppData/Local/nvim
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +42 init.vim
badd +1 NERD_tree_1
badd +4 ~/Desktop/dev/tracker/src/components/Tracker/index.tsx
badd +0 term://~/Desktop/dev/tracker/src/components/Tracker//1728:C:/Windows/system32/cmd.exe
argglobal
%argdel
edit ~/Desktop/dev/tracker/src/components/Tracker/index.tsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
split
1wincmd k
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 31 + 22) / 44)
exe '2resize ' . ((&lines * 10 + 22) / 44)
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 4 - ((2 * winheight(0) + 15) / 31)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 4
normal! 0
lcd ~/Desktop/dev/tracker/src/components/Tracker
wincmd w
argglobal
if bufexists("term://~/Desktop/dev/tracker/src/components/Tracker//1728:C:/Windows/system32/cmd.exe") | buffer term://~/Desktop/dev/tracker/src/components/Tracker//1728:C:/Windows/system32/cmd.exe | else | edit term://~/Desktop/dev/tracker/src/components/Tracker//1728:C:/Windows/system32/cmd.exe | endif
if &buftype ==# 'terminal'
  silent file term://~/Desktop/dev/tracker/src/components/Tracker//1728:C:/Windows/system32/cmd.exe
endif
balt ~/Desktop/dev/tracker/src/components/Tracker/index.tsx
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 4 - ((3 * winheight(0) + 5) / 10)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 4
normal! 058|
lcd ~/Desktop/dev/tracker/src/components/Tracker
wincmd w
2wincmd w
exe '1resize ' . ((&lines * 31 + 22) / 44)
exe '2resize ' . ((&lines * 10 + 22) / 44)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0&& getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToOFcI
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
