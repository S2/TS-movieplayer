#!/usr/bin/env perl
use 5.16.2;
use strict;
use warnings;
use utf8;
use SVG;

my $svg = SVG->new(
        -printerror => 1,
        -raiseerror => 0,
        -indent     => '  ',
        -docroot => '', #default document root element (SVG specification assumes svg). Defaults to 'svg' if undefined
        -sysid      => 'abc', #optional system identifyer
        -pubid      => "-//W3C//DTD SVG 1.0//EN", #public identifyer default value is "-//W3C//DTD SVG 1.0//EN" if undefined
#        -namespace => 'controls',
        -inline   => 1 ,
        id          => 'largePlayButton',
        width       => 300,
        height      => 300,
);

$svg->rectangle(
    x => 0, y => 10,
    width=> 200, height=> 20,
    rx=>5.2, ry=>2.4,
    id=>'rect_1',
    style=>{
        'fill-opacity' => 1,
        'fill'   => 'black',
        'stroke' => 'black'
    }
);

$svg->rectangle(
    x => 0, y => 15,
    width=> 180, height=> 10,
    rx=>5.2, ry=>2.4,
    id=>'rect_2' , 
    style=>{
        'fill-opacity' => 1,
        'fill'   => 'white',
        'stroke' => 'white'
    }
);

my $x = 20;
while($x <  200){
    $svg->line(
        x1 => $x, 
        x2 => $x, 
        y1 => 10,
        y2 => 30,
        style=>{
            'stroke' => 'black'
        }
    );
    $x += 10;
}

say $svg->xmlify
