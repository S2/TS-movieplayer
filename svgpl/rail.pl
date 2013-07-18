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

$svg->circle(cx => 20 , cy => 20 , r => 10 , stroke => 'gray');
$svg->circle(cx => 120 , cy => 20 , r => 10 , stroke => 'gray');
$svg->line(x1 => 20 , x2 => 120 ,  y1 => 30 , y2 => 30 , stroke => 'gray');
$svg->line(x1 => 20 , x2 => 120 ,  y1 => 10 , y2 => 10 , stroke => 'gray');
say $svg->xmlify
