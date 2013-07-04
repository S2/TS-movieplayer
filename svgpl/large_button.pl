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

my $tag = $svg->circle(cx => 150 , cy => 150 , r => 100 , stroke => 'black', fill => 'none');
my $points = $svg->get_path(x => [150 - 50 , 150 - 50, 150 + 70], y => [150 - 50 , 150 + 50 , 150] ,-type => 'polyline'  ,-closed=>'true');
$svg->polyline(%$points , stroke => 'black', fill => 'gray');
say $svg->xmlify
